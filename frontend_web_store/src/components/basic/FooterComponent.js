import '../../css/components/basic/Footer.css';

export default function FooterComponent(props) {
  return (
    <div className={props.position === 'absolute' ? 'absolute' : 'relative'}>
      <p
        className={
          props.variant === 'dark'
            ? 'copyright d-flex bg-dark text-light justify-content-center align-items-center'
            : props.variant === 'light'
              ? 'copyright d-flex bg-light text-dark justify-content-center align-items-center'
              : props.color === 'white'
                ? 'copyright d-flex text-white justify-content-center align-items-center'
                : 'copyright d-flex justify-content-center align-items-center'
        }
      >
        © 2023 Ghiffary Rifqialdi
      </p>
    </div>
  );
}
