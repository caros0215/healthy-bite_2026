import styles from "./verde.module.css"

export default function CateringHeader() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.subtitle}>HAZ TU PEDIDO</p>
        <h1 className={styles.title}>
          COMO PEDIR
          <br />
          UN CATERING.
        </h1>
      </div>
    </div>
  )
}
