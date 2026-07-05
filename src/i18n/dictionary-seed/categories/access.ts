import { TermTuple } from '../types';

/** Авторизация и права доступа (namespace: dict.access) */
export const accessTerms: TermTuple[] = [
  ['permission', 'Право доступа', 'Permission', 'Қол жеткізу құқығы', 'İzin', '权限'],
  ['role', 'Роль', 'Role', 'Рөл', 'Rol', '角色'],
  ['userGroup', 'Группа пользователей', 'User Group', 'Пайдаланушылар тобы', 'Kullanıcı Grubu', '用户组'],
  ['accessLevel', 'Уровень доступа', 'Access Level', 'Қол жеткізу деңгейі', 'Erişim Seviyesi', '访问级别'],
  ['twoFactorAuth', 'Двухфакторная аутентификация', 'Two-Factor Authentication', 'Екі факторлы аутентификация', 'İki Faktörlü Kimlik Doğrulama', '双因素认证'],
  ['singleSignOn', 'Единый вход', 'Single Sign-On', 'Бірыңғай кіру', 'Tekli Oturum Açma', '单点登录'],
  ['sessionManagement', 'Управление сессиями', 'Session Management', 'Сессияларды басқару', 'Oturum Yönetimi', '会话管理'],
  ['accessToken', 'Токен доступа', 'Access Token', 'Қол жеткізу токені', 'Erişim Belirteci', '访问令牌'],
  ['passwordReset', 'Сброс пароля', 'Password Reset', 'Құпия сөзді қалпына келтіру', 'Şifre Sıfırlama', '密码重置'],
  ['accountLocked', 'Учётная запись заблокирована', 'Account Locked', 'Есептік жазба құлыпталған', 'Hesap Kilitlendi', '账户已锁定'],
  ['loginAttempt', 'Попытка входа', 'Login Attempt', 'Кіру әрекеті', 'Giriş Denemesi', '登录尝试'],
  ['accessRequest', 'Запрос на доступ', 'Access Request', 'Қол жеткізуге сұрау', 'Erişim Talebi', '访问申请'],
  ['roleAssignment', 'Назначение роли', 'Role Assignment', 'Рөлді тағайындау', 'Rol Ataması', '角色分配'],
  ['permissionGrant', 'Предоставление прав', 'Permission Grant', 'Құқық беру', 'İzin Verme', '权限授予'],
  ['permissionRevoke', 'Отзыв прав', 'Permission Revoke', 'Құқықты кері қайтарып алу', 'İzni Kaldırma', '撤销权限'],
  ['auditTrail', 'Журнал аудита', 'Audit Trail', 'Аудит журналы', 'Denetim İzi', '审计跟踪'],
  ['securityPolicy', 'Политика безопасности', 'Security Policy', 'Қауіпсіздік саясаты', 'Güvenlik Politikası', '安全策略'],
  ['dataPrivacy', 'Конфиденциальность данных', 'Data Privacy', 'Деректер құпиялылығы', 'Veri Gizliliği', '数据隐私'],
  ['userSession', 'Сессия пользователя', 'User Session', 'Пайдаланушы сессиясы', 'Kullanıcı Oturumu', '用户会话'],
  ['activeDirectory', 'Служба каталогов', 'Active Directory', 'Каталог қызметі', 'Aktif Dizin', '活动目录'],
];
