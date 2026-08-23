/**
 * @typedef {Object} Route
 * @property {string} title — заголовок страницы
 * @property {string} filename — имя HTML-файла в src/pages/
 */

/** @type {Route[]} */
const baseRoutes = [
  {
    title: 'Главная страница',
    filename: 'index.html',
  },
]

module.exports = [
  ...baseRoutes,
]
