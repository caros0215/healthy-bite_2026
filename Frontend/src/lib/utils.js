/**
 * Combina nombres de clases condicionalmente
 * Esta función es similar a la librería clsx o classnames
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}
