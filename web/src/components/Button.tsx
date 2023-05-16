import React from 'react'

const styles = {
  color: 'red',
}

interface PropsButton {
  title: string
}

const Button = ({ title }: PropsButton) => {
  return <div style={styles}>{title}</div>
}

export default Button
