import {
  ERROR_CODES,
  type AuthSession,
  type LoginInput,
  type SignupInput,
  type TenantDto,
  type UserDto,
} from '@erp/shared';
import { requestContext } from '../../../core/context/request-context';
import { SKIP_TENANT_SCOPE } from '../../../core/database/plugins/tenant-scope.plugin';
import { withTransaction } from '../../../core/database/transaction';
import { AppError } from '../../../core/errors/app-error';
import { hashPassword, verifyPassword } from '../../../core/security/password';
import { signAccessToken } from '../../../core/security/tokens';
import { TenantModel, toTenantDto, type TenantDocument } from '../../platform/tenants/tenant.model';
import { UserModel, toUserDto, type UserDocument } from '../users/user.model';

const INVALID_CREDENTIALS = 'Invalid email or password';

let dummyHash: Promise<string> | undefined;
/** Verifying against a dummy hash keeps response times equal for unknown emails (no user enumeration). */
function getDummyHash(): Promise<string> {
  dummyHash ??= hashPassword('timing-attack-mitigation-placeholder');
  return dummyHash;
}

async function issueSession(user: UserDocument, tenant: TenantDocument): Promise<AuthSession> {
  const accessToken = await signAccessToken({
    sub: user._id.toString(),
    tid: tenant._id.toString(),
    role: user.role,
  });
  return { accessToken, user: toUserDto(user), tenant: toTenantDto(tenant) };
}

/** Creates a tenant (company) and its owner in one transaction, then logs the owner in. */
export async function signup(input: SignupInput): Promise<AuthSession> {
  const emailTaken = await UserModel.exists({ email: input.email }).setOptions({
    [SKIP_TENANT_SCOPE]: true,
  });
  if (emailTaken) {
    throw AppError.conflict('An account with this email already exists', ERROR_CODES.EMAIL_TAKEN);
  }

  const passwordHash = await hashPassword(input.password);

  const { tenant, user } = await withTransaction(async () => {
    const tenant = await new TenantModel({ name: input.companyName }).save();
    const user = await new UserModel({
      tenantId: tenant._id,
      name: input.name,
      email: input.email,
      passwordHash,
      role: 'owner',
    }).save();
    return { tenant, user };
  });

  return issueSession(user, tenant);
}

export async function login(input: LoginInput): Promise<AuthSession> {
  // Platform-level lookup: the tenant is not known before login.
  const user = await UserModel.findOne({ email: input.email })
    .select('+passwordHash')
    .setOptions({ [SKIP_TENANT_SCOPE]: true });

  const passwordOk = await verifyPassword(
    user?.passwordHash ?? (await getDummyHash()),
    input.password,
  );
  if (!user || !passwordOk || user.status !== 'active') {
    throw AppError.unauthorized(INVALID_CREDENTIALS);
  }

  const tenant = await TenantModel.findById(user.tenantId);
  if (!tenant || tenant.status === 'suspended') {
    throw AppError.forbidden('This company account is suspended');
  }

  user.lastLoginAt = new Date();
  await user.save();

  return issueSession(user, tenant);
}

/** The signed-in user and tenant, resolved from the request context. */
export async function getCurrentUser(): Promise<{ user: UserDto; tenant: TenantDto }> {
  const context = requestContext.get();
  if (!context?.userId || !context.tenantId) throw AppError.unauthorized();

  const [user, tenant] = await Promise.all([
    UserModel.findById(context.userId),
    TenantModel.findById(context.tenantId),
  ]);
  if (!user || !tenant) throw AppError.unauthorized();

  return { user: toUserDto(user), tenant: toTenantDto(tenant) };
}
