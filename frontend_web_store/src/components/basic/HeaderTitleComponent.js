export default function HeaderTitleComponent({
    title,
    divider
}) {
    return (
        <div className="container py-4">
            <div className="fs-2">
                {title}
            </div>
            {divider && <hr />}
        </div>
    )
}

HeaderTitleComponent.defaultProps = {
    title: "",
    divider: false
}