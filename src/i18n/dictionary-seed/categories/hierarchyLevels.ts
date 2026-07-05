import { TermTuple } from '../types';

/** Названия уровней иерархии сущностей (namespace: dict.levels) */
export const hierarchyLevelsTerms: TermTuple[] = [
  ['root', 'Noventra Core', 'Noventra Core', 'Noventra Core', 'Noventra Core', 'Noventra Core'],
  ['organization', 'Организация (Tenant)', 'Organization (Tenant)', 'Ұйым (Tenant)', 'Kuruluş (Tenant)', '组织（租户）'],
  ['company', 'Компания (Заказчик)', 'Company (Customer)', 'Компания (Тапсырыс беруші)', 'Şirket (Müşteri)', '公司（客户）'],
  ['project', 'Проект', 'Project', 'Жоба', 'Proje', '项目'],
  ['object', 'Объект', 'Object', 'Нысан', 'Nesne', '对象'],
  ['site', 'Строительная площадка', 'Construction Site', 'Құрылыс алаңы', 'Şantiye', '施工现场'],
  ['contractor', 'Подрядная организация', 'Contractor Organization', 'Мердігерлік ұйым', 'Yüklenici Kuruluş', '承包组织'],
  ['subdivision', 'Подразделение подрядчика', "Contractor's Subdivision", 'Мердігердің бөлімшесі', 'Yüklenici Alt Birimi', '承包商部门'],
  ['user', 'Пользователь', 'User', 'Пайдаланушы', 'Kullanıcı', '用户'],

  ['childRoot', 'Организации', 'Organizations', 'Ұйымдар', 'Kuruluşlar', '组织'],
  ['childOrganization', 'Компании организации', "Organization's Companies", 'Ұйымның компаниялары', 'Kuruluşun Şirketleri', '组织的公司'],
  ['childCompany', 'Проекты компании', "Company's Projects", 'Компанияның жобалары', 'Şirketin Projeleri', '公司的项目'],
  ['childProject', 'Объекты проекта', "Project's Objects", 'Жобаның нысандары', 'Projenin Nesneleri', '项目的对象'],
  ['childObject', 'Строительные площадки объекта', "Object's Construction Sites", 'Нысанның құрылыс алаңдары', 'Nesnenin Şantiyeleri', '对象的施工现场'],
  ['childSite', 'Подрядные организации площадки', "Site's Contractor Organizations", 'Алаңның мердігерлік ұйымдары', 'Şantiyenin Yüklenici Kuruluşları', '现场的承包组织'],
  ['childContractor', 'Подразделения подрядчика', "Contractor's Subdivisions", 'Мердігердің бөлімшелері', 'Yüklenicinin Alt Birimleri', '承包商的部门'],
  ['childSubdivision', 'Пользователи подразделения', "Subdivision's Users", 'Бөлімшенің пайдаланушылары', 'Alt Birimin Kullanıcıları', '部门的用户'],
];
