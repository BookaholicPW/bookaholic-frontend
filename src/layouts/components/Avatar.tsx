export default function Avatar(props: {
  alt: string
  src: string
  width: string
  height: string
}) {
  const { src, width, height } = props
  return (
    <img
      src={src}
      width={width}
      height={height}
      style={{
        borderRadius: '50%',
        display: 'block',
        marginLeft: 'auto',
        marginRight: '0',
      }}
    ></img>
  )
}
