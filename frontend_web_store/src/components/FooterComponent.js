function FooterComponent(props) {
    return (
        <div
            className={
                props.position === "absolute"
                    ? props.page === "Home"
                        ? "footer footer-home footer-absolute"
                        : "footer footer-absolute"
                    : "footer"
            }
        >
            <p className="copyright d-flex justify-content-center align-items-center">© 2023 Ghiffary Rifqialdi</p>
        </div>
    );
}

export default FooterComponent;
