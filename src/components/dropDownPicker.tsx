import { faSquare } from "@fortawesome/free-regular-svg-icons/faSquare";
import {
    faCheckSquare,
    faChevronCircleDown,
    faChevronCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

interface DropDownItem {
    id?: number;
    label?: string;
    value: string;
    selected: boolean;
}

interface BaseDropDownProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    value: DropDownItem[];
    setValue: Dispatch<SetStateAction<DropDownItem[]>>;
    labelname: string,
    onClick: () => void
}

interface MultipleDropDownProps extends BaseDropDownProps {
    multiple: true;
    onSelectItem: (value: string[]) => void;
}

interface SingleDropDownProps extends BaseDropDownProps {
    multiple?: false;
    onSelectItem: (value: string) => void;
}

type DropDownProps = MultipleDropDownProps | SingleDropDownProps;

export default function DropDownPicker({
    multiple,
    open,
    setOpen,
    value,
    setValue,
    onSelectItem,
    labelname,
    onClick
}: DropDownProps) {
    const dropDownRef = useRef<HTMLDivElement | null>(null);

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]); // Store refs for each item

    const scrollToElement = (index: number) => {
        itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
            setOpen(false)
        }
        else {
            console.log("else of the event");
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open])

    const handleSelectedValues = (item: DropDownItem) => {
        setValue((prev) => {
            const selectedItems = prev
                .filter((i) => i.selected)
                .map((i) => i.value);

            if (multiple) {
                onSelectItem(selectedItems); // Now, selectedItems is up-to-date
            } else {
                setOpen(false); // Close dropdown for single select
                onSelectItem(item.value);
            }
            return prev;
        });
    };



    return (
        <div ref={dropDownRef} className="relative w-full mt-5 ">

            {/* Toggle Button */}
            <button
                type='button'
                className={`px-3 py-2 bg-white w-full flex border justify-between items-center ${open ? "rounded-t-xl border-primary" : "rounded-xl border-black"
                    }`}
                onClick={() => {
                    setOpen((prev) => !prev)
                    onClick()
                }}
            >
                <p className="text-black text-base font-medium">{labelname}</p>
                <FontAwesomeIcon icon={open ? faChevronCircleDown : faChevronCircleUp} className={open ? "text-primary" : "text-gray-500"} />
            </button>

            {/* Dropdown List */}
            {open && <div
                className={`absolute border border-primary bg-white w-full z-10 overflow-y-auto transform transition-all duration-100 ${open ? "opacity-100 translate-y-0 max-h-[120px] " : " max-h-[0px] opacity-0 -translate-y-4"
                    } px-2`}
            >
                {value.map((item, index) => (
                    <div
                        ref={(el) => {
                            itemRefs.current[index] = el; // ✅ Correct way to set ref
                        }}
                        key={item.id || index}
                        className="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                            scrollToElement(index)
                            setValue((prev) =>
                                prev.map((data) =>
                                    data.value === item.value
                                        ? { ...data, selected: !item.selected }
                                        : data
                                )
                            );

                            handleSelectedValues(item)
                        }
                        }
                    >
                        <FontAwesomeIcon icon={item.selected ? faCheckSquare : faSquare} className="text-gray-500" />
                        <p className={`text-[14px] ${item.selected ? "text-primary" : "text-gray-500"} font-normal capitalize px-2`}>
                            {item.label || item.value}
                        </p>
                    </div>
                ))}
            </div>}

        </div>
    );
}
