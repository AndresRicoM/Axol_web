export default function ApplicationLogo(props) {
    return (
        <div className="flex flex-row gap-2">
            <img {...props} src="/assets/AxolSitting.png" alt="Mi Logo" />
            <img {...props} src="/assets/logosblack.png" alt="MIT City Science" />
        </div>
    );
}