
/**
 * Сервис для работы с ссылками через API
 */

export interface Link {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags?: string[];
  createdAt: string;
}

/**
 * Получает список всех ссылок с сервера
 */
export async function getLinks(): Promise<Link[]> {
  try {
    const response = await fetch('/api/links');
    if (!response.ok) {
      throw new Error('Не удалось получить список ссылок');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching links:', error);
    // Если не удалось получить данные с сервера, возвращаем пустой массив
    return [];
  }
}

/**
 * Сохраняет список ссылок на сервере
 */
export async function saveLinks(links: Link[]): Promise<boolean> {
  try {
    const response = await fetch('/api/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(links),
    });

    if (!response.ok) {
      throw new Error('Не удалось сохранить ссылки');
    }

    return true;
  } catch (error) {
    console.error('Error saving links:', error);
    return false;
  }
}
