import { TermTuple } from '../types';

/** Разрешительная система работ (namespace: dict.permits) */
export const permitsTerms: TermTuple[] = [
  ['permitToWorkSystem', 'Система нарядов-допусков', 'Permit to Work System', 'Жұмысқа рұқсат жүйесі', 'Çalışma İzni Sistemi', '工作许可制度'],
  ['permitIssuer', 'Выдающий наряд-допуск', 'Permit Issuer', 'Рұқсат беруші', 'İzin Veren', '许可签发人'],
  ['permitHolder', 'Держатель наряда-допуска', 'Permit Holder', 'Рұқсат ұстаушысы', 'İzin Sahibi', '许可持有人'],
  ['permitValidityPeriod', 'Срок действия наряда-допуска', 'Permit Validity Period', 'Рұқсаттың қолданылу мерзімі', 'İzin Geçerlilik Süresi', '许可有效期'],
  ['permitClosure', 'Закрытие наряда-допуска', 'Permit Closure', 'Рұқсатты жабу', 'İzin Kapatma', '许可关闭'],
  ['permitSuspension', 'Приостановка наряда-допуска', 'Permit Suspension', 'Рұқсатты тоқтата тұру', 'İzin Askıya Alma', '许可暂停'],
  ['coldWorkPermit', 'Наряд-допуск на холодные работы', 'Cold Work Permit', 'Суық жұмыстарға рұқсат', 'Soğuk Çalışma İzni', '冷作业许可证'],
  ['excavationPermit', 'Наряд-допуск на земляные работы', 'Excavation Permit', 'Жер жұмыстарына рұқсат', 'Kazı İzni', '开挖许可证'],
  ['heightWorkPermit', 'Наряд-допуск на работы на высоте', 'Height Work Permit', 'Биіктікте жұмыс істеуге рұқсат', 'Yükseklik Çalışma İzni', '高处作业许可证'],
  ['confinedSpacePermit', 'Наряд-допуск на работы в замкнутом пространстве', 'Confined Space Permit', 'Шектелген кеңістікте жұмысқа рұқсат', 'Kapalı Alan Çalışma İzni', '受限空间作业许可证'],
  ['electricalWorkPermit', 'Наряд-допуск на электротехнические работы', 'Electrical Work Permit', 'Электротехникалық жұмыстарға рұқсат', 'Elektrik Çalışma İzni', '电气作业许可证'],
  ['radiographyPermit', 'Наряд-допуск на радиографические работы', 'Radiography Permit', 'Радиографиялық жұмыстарға рұқсат', 'Radyografi İzni', '射线检测许可证'],
  ['liftingPermit', 'Наряд-допуск на грузоподъёмные работы', 'Lifting Permit', 'Жүк көтеру жұмыстарына рұқсат', 'Kaldırma İzni', '起重作业许可证'],
  ['permitApprover', 'Согласующий наряд-допуск', 'Permit Approver', 'Рұқсатты келісуші', 'İzin Onaylayıcı', '许可审批人'],
  ['workAuthorization', 'Разрешение на выполнение работ', 'Work Authorization', 'Жұмыс орындауға рұқсат', 'Çalışma Yetkisi', '工作授权'],
  ['isolationCertificate', 'Сертификат изоляции оборудования', 'Isolation Certificate', 'Жабдықты оқшаулау сертификаты', 'İzolasyon Sertifikası', '隔离证书'],
  ['gasTestCertificate', 'Сертификат анализа воздушной среды', 'Gas Test Certificate', 'Ауа ортасын талдау сертификаты', 'Gaz Testi Sertifikası', '气体检测证书'],
  ['permitRegister', 'Реестр нарядов-допусков', 'Permit Register', 'Рұқсаттар тізілімі', 'İzin Kayıt Defteri', '许可证登记册'],
  ['permitAudit', 'Аудит нарядов-допусков', 'Permit Audit', 'Рұқсаттар аудиті', 'İzin Denetimi', '许可证审计'],
  ['permitBreach', 'Нарушение условий наряда-допуска', 'Permit Breach', 'Рұқсат шарттарын бұзу', 'İzin İhlali', '许可证违规'],
];
