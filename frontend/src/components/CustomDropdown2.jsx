import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption
  } from "@headlessui/react";
  import { ChevronDownIcon } from "@heroicons/react/20/solid";
  
  function CustomDropdown2({ value, onChange, options }) {
    const selected = options.find((opt) => opt.value === value) || options[0];
  
    return (
      <Listbox value={value} onChange={onChange}>
        <div className="relative w-full">
          <ListboxButton className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 focus:outline-none shadow-inner text-left flex justify-between items-center">
            <span>{selected.label}</span>
            <ChevronDownIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          </ListboxButton>
          <ListboxOptions className="absolute z-10 mt-1 max-h-120 w-full overflow-auto rounded-xl bg-white text-gray-800 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
            {options.map((opt) => (
              <ListboxOption
                key={opt.value}
                value={opt.value}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-1 ${
                    active ? "bg-indigo-100 text-indigo-700" : ""
                  }`
                }
              >
                {opt.label}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    );
  }
  
export default CustomDropdown2;