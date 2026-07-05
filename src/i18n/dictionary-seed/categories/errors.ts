import { TermTuple } from '../types';

/** Сообщения об ошибках (namespace: dict.errors) */
export const errorsTerms: TermTuple[] = [
  ['genericError', 'Произошла ошибка', 'An error occurred', 'Қате орын алды', 'Bir hata oluştu', '发生错误'],
  ['networkError', 'Ошибка сети', 'Network Error', 'Желі қатесі', 'Ağ Hatası', '网络错误'],
  ['serverError', 'Ошибка сервера', 'Server Error', 'Сервер қатесі', 'Sunucu Hatası', '服务器错误'],
  ['notFound', 'Не найдено', 'Not Found', 'Табылмады', 'Bulunamadı', '未找到'],
  ['accessDenied', 'Доступ запрещён', 'Access Denied', 'Кіруге тыйым салынған', 'Erişim Reddedildi', '拒绝访问'],
  ['sessionExpired', 'Сессия истекла', 'Session Expired', 'Сессия аяқталды', 'Oturum Süresi Doldu', '会话已过期'],
  ['invalidCredentials', 'Неверные учётные данные', 'Invalid Credentials', 'Есептік деректер қате', 'Geçersiz Kimlik Bilgileri', '凭证无效'],
  ['requiredFieldMissing', 'Отсутствует обязательное поле', 'Required field missing', 'Міндетті өріс жоқ', 'Zorunlu alan eksik', '缺少必填字段'],
  ['invalidEmailFormat', 'Неверный формат email', 'Invalid email format', 'Email пішімі қате', 'Geçersiz e-posta formatı', '电子邮件格式无效'],
  ['fileTooLarge', 'Файл слишком большой', 'File is too large', 'Файл тым үлкен', 'Dosya çok büyük', '文件过大'],
  ['unsupportedFileType', 'Неподдерживаемый тип файла', 'Unsupported file type', 'Қолдау көрсетілмейтін файл түрі', 'Desteklenmeyen dosya türü', '不支持的文件类型'],
  ['duplicateEntry', 'Дублирующаяся запись', 'Duplicate entry', 'Қайталанатын жазба', 'Yinelenen kayıt', '重复条目'],
  ['operationFailed', 'Операция не выполнена', 'Operation failed', 'Операция орындалмады', 'İşlem başarısız oldu', '操作失败'],
  ['connectionTimeout', 'Превышено время ожидания соединения', 'Connection timeout', 'Байланыс күту уақыты асып кетті', 'Bağlantı zaman aşımı', '连接超时'],
  ['permissionDenied', 'Недостаточно прав', 'Permission denied', 'Құқықтар жеткіліксіз', 'İzin reddedildi', '权限不足'],
  ['validationFailed', 'Проверка данных не пройдена', 'Validation failed', 'Деректерді тексеру сәтсіз аяқталды', 'Doğrulama başarısız oldu', '数据验证失败'],
  ['unexpectedError', 'Непредвиденная ошибка', 'Unexpected error', 'Күтпеген қате', 'Beklenmeyen hata', '意外错误'],
  ['tryAgainLater', 'Повторите попытку позже', 'Please try again later', 'Кейінірек қайталап көріңіз', 'Lütfen daha sonra tekrar deneyin', '请稍后再试'],
  ['itemAlreadyExists', 'Такая запись уже существует', 'Item already exists', 'Мұндай жазба бұрыннан бар', 'Öğe zaten mevcut', '该条目已存在'],
  ['cannotDeleteInUse', 'Невозможно удалить: запись используется', 'Cannot delete: item is in use', 'Жоюға болмайды: жазба пайдаланылуда', 'Silinemez: öğe kullanımda', '无法删除：条目正在使用中'],
];
