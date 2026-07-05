import { TermTuple } from '../types';

/** Роли пользователей (namespace: dict.roles) */
export const rolesTerms: TermTuple[] = [
  ['administrator', 'Администратор', 'Administrator', 'Әкімші', 'Yönetici', '管理员'],
  ['superAdmin', 'Суперадминистратор', 'Super administrator', 'Супер әкімші', 'Süper yönetici', '超级管理员'],
  ['hseManager', 'Руководитель ОТ и ПБ', 'HSE Manager', 'ЕҚ және ӨҚ басшысы', 'İSG Yöneticisi', '安全环保经理'],
  ['hseSpecialist', 'Специалист по ОТ', 'HSE Specialist', 'ЕҚ маманы', 'İSG Uzmanı', '安全环保专员'],
  ['safetyEngineer', 'Инженер по охране труда', 'Safety Engineer', 'Еңбекті қорғау инженері', 'İş Güvenliği Mühendisi', '安全工程师'],
  ['siteManager', 'Начальник участка', 'Site Manager', 'Учаске бастығы', 'Şantiye Şefi', '现场经理'],
  ['foreman', 'Прораб', 'Foreman', 'Прораб', 'Şantiye Şefi Yardımcısı', '工长'],
  ['worker', 'Рабочий', 'Worker', 'Жұмысшы', 'İşçi', '工人'],
  ['contractor', 'Подрядчик', 'Contractor', 'Мердігер', 'Yüklenici', '承包商'],
  ['inspector', 'Инспектор', 'Inspector', 'Инспектор', 'Denetçi', '检查员'],
  ['auditor', 'Аудитор', 'Auditor', 'Аудитор', 'Denetçi', '审计员'],
  ['investigator', 'Следователь по инцидентам', 'Incident Investigator', 'Оқиғаларды тергеуші', 'Olay Soruşturmacısı', '事故调查员'],
  ['trainingCoordinator', 'Координатор обучения', 'Training Coordinator', 'Оқыту үйлестірушісі', 'Eğitim Koordinatörü', '培训协调员'],
  ['environmentalOfficer', 'Специалист по экологии', 'Environmental Officer', 'Эколог маман', 'Çevre Görevlisi', '环保专员'],
  ['fireSafetyOfficer', 'Специалист по ПБ', 'Fire Safety Officer', 'Өрт қауіпсіздігі маманы', 'Yangın Güvenliği Görevlisi', '消防安全专员'],
  ['guest', 'Гость', 'Guest', 'Қонақ', 'Misafir', '访客'],
  ['viewer', 'Наблюдатель', 'Viewer', 'Бақылаушы', 'İzleyici', '查看者'],
  ['editor', 'Редактор', 'Editor', 'Редактор', 'Editör', '编辑者'],
  ['approver', 'Согласующий', 'Approver', 'Келісуші', 'Onaylayan', '审批人'],
  ['topManager', 'Топ-менеджер', 'Top Manager', 'Топ-менеджер', 'Üst Düzey Yönetici', '高层管理者'],
];
