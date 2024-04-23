import "../sass/button.scss";

const Button = ({ to, children, onClick }) => {
    let Comp = "button";

    const props = {
        onClick,
    };

    return (
        <Comp className="button" {...props}>
            <span>{children}</span>
        </Comp>
    );
};

export default Button;
