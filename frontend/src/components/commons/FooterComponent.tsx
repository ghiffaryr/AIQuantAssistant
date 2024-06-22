import '@/style/components/commons/Footer.css';

const FooterComponent = ({ position, variant, color }: FooterComponentType) => {
  return (
    <div className={position === 'absolute' ? 'absolute' : 'relative'}>
      <p
        className={
          variant === 'dark'
            ? 'copyright d-flex bg-dark text-light justify-content-center align-items-center'
            : variant === 'light'
              ? 'copyright d-flex bg-light text-dark justify-content-center align-items-center'
              : color === 'white'
                ? 'copyright d-flex text-white justify-content-center align-items-center'
                : 'copyright d-flex justify-content-center align-items-center'
        }>
        © 2023 Ghiffary Rifqialdi
      </p>
    </div>
  );
};

type FooterComponentType = {
  position?: string;
  variant?: string;
  color?: string;
};

export default FooterComponent;
