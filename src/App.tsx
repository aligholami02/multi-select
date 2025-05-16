import './styles/index.scss'

import {useState, useRef, useEffect} from "react";

type Option = {
    label: string;
    value: string;
};

const initialOptions: Option[] = [
    {label: "Education", value: "education"},
    {label: "Yes, science!", value: "science"},
    {label: "Art", value: "art"},
    {label: "Sport", value: "sport"},
    {label: "Games", value: "games"},
    {label: "Health", value: "health"},
];

const App = () => {
    const [options, setOptions] = useState<Option[]>(initialOptions);
    const [selected, setSelected] = useState<Option[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAddOption = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !options.find((opt) => opt.label === trimmed)) {
            const newOption = {label: trimmed, value: trimmed.toLowerCase().replace(/\s+/g, "_")};
            setOptions((prev) => [...prev, newOption]);
            setSelected((prev) => [...prev, newOption]);
        } else if (trimmed) {
            const existing = options.find((opt) => opt.label === trimmed);
            if (existing && !selected.find((s) => s.value === existing.value)) {
                setSelected((prev) => [...prev, existing]);
            }
        }
        setInputValue("");
    };

    const toggleOption = (option: Option) => {
        if (selected.find((s) => s.value === option.value)) {
            setSelected(selected.filter((s) => s.value !== option.value));
        } else {
            setSelected([...selected, option]);
        }
    };

    return (
        <div ref={wrapperRef} className="relative w-80 text-left">
            <div
                onClick={() => setOpen(!open)}
                className="border rounded p-2 cursor-pointer flex flex-wrap gap-2 min-h-[42px]"
            >
                {selected.map((s) => (
                    <span key={s.value} className="bg-blue-100 px-2 py-1 rounded text-sm">
            {s.label}
          </span>
                ))}
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddOption();
                        }
                    }}
                    className="flex-1 border-none outline-none"
                    placeholder="Type and press Enter..."
                />
            </div>

            {open && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow max-h-60 overflow-auto">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => toggleOption(option)}
                            className={`cursor-pointer p-2 hover:bg-gray-100 flex justify-between ${
                                selected.find((s) => s.value === option.value) ? "bg-blue-100" : ""
                            }`}
                        >
                            <span>{option.label}</span>
                            {selected.find((s) => s.value === option.value) && <span>✔️</span>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;
