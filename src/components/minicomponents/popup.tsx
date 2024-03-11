import { useEffect, useState } from "react"
import { animation } from "../../assets/univeralstyles"
import closeIcon from '../../assets/icons/closeIcon.svg'

interface Props {
    message: string
}

export function Popup(props: Props) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
        const timerId = setTimeout(() => {
            setVisible(false); // Disable popup after 5 seconds
        }, 5000);

        return () => clearTimeout(timerId)
    }, [props])


    const visibleStyles = `absolute top-9 left-[50%] transform -translate-x-1/2 ${animation}`
    const nonVisibleStyles = `absolute top-[-10%] left-[50%] transform -translate-x-1/2 ${animation}`
    return (
        <div className={`${visible ? visibleStyles : nonVisibleStyles} text-[14px] flex items-center`}>
            <p className={`line-clamp-1`}>{props.message}</p>
            {props.message && <img src={closeIcon} className={`ml-2 w-[1rem]`}
                onClick={() => setVisible(false)}
            />}
        </div>
    )
}