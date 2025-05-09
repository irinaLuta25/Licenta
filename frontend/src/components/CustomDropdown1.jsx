import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function CustomDropdown1({ value, onChange, options }) {
    const selected = options.find((opt) => opt.value === value) || options[0];

    return (
        <Listbox value={value} onChange={onChange}>
            <div className="relative w-44">
                <ListboxButton className="relative w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#cbc0f3] via-[#cadbf9] to-[#deecff] text-indigo-700 font-medium py-2 pl-4 pr-10 text-left backdrop-blur-sm shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    {selected.label}
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDownIcon className="h-5 w-5 text-indigo-700" aria-hidden="true" />
                    </span>
                </ListboxButton>

                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white/90 text-gray-800 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                    {options.map((opt) => (
                        <ListboxOption key={opt.value} value={opt.value}>
                            {({ active }) => (
                                <div
                                    className={`cursor-pointer select-none px-4 py-2 rounded-md ${
                                        active ? "bg-indigo-100 text-indigo-700" : ""
                                    }`}
                                >
                                    {opt.label}
                                </div>
                            )}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
}

export default CustomDropdown1;
