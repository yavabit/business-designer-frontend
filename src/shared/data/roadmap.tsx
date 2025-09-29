export interface TimelineItem {
	date: string;
	title: string;
	description: string;
	done?: boolean;
	process?: boolean;
}

export const roadmapItems: TimelineItem[] = [
    { date: '01.08.25', title: 'Start', description: 'Старт проекта', done: true },
	{ date: '01.02.25', title: 'Planning', description: 'Написание БФТ', done: true },
    { date: '01.03.25', title: 'Design', description: 'Проработка дизайна', done: true },
    { date: '01.04.25', title: 'Development', description: 'Начало разработки', done: true },
    { date: '01.05.25', title: 'Development', description: 'Общая архитектура', done: true },
    { date: '01.07.25', title: 'Development', description: 'Авторизация и регистрация', done: true },
    { date: '01.07.25', title: 'Feature', description: 'Категория бизнес-процессов', done: true },
    { date: '01.07.25', title: 'Feature', description: 'Категория агентов', done: true },
    { date: '01.07.25', title: 'Feature', description: 'Мультикурсор', done: true },
    { date: '01.07.25', title: 'Development', description: 'Проверка запуска процесса', done: true, process: true },
    { date: '01.07.25', title: 'Feature', description: 'Категория повседневной жизни', done: false },
    { date: '01.07.25', title: 'Feature', description: 'Категория подписок', done: false },
    { date: '01.07.25', title: 'Feature', description: 'Ролевая модель', done: false },
    { date: '01.07.25', title: 'Development', description: 'Интеграция логики с сервером', done: false },
    { date: '01.07.25', title: 'Design', description: 'Правки по дизайну', done: false },
    { date: '01.07.25', title: 'Design', description: 'Мобильная адаптация', done: false },
    { date: '01.07.25', title: 'Development', description: 'Покрытие автотестами', done: false },
    { date: '01.07.25', title: 'Testing', description: 'Финальное тестирование', done: false },
    { date: '01.07.25', title: 'Launch', description: 'Запуск продукта', done: false },
]
