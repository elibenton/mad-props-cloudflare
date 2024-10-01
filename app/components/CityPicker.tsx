import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
	Label
} from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import cities from '../data/californiaCities.json'

interface CityPickerProps {
	onCityChange: (city: string) => void
}

export default function CityPicker({ onCityChange }: CityPickerProps) {
	const [query, setQuery] = useState('')
	const [selectedCity, setSelectedCity] = useState(null)

	const filteredCities =
		query === ''
			? cities
			: cities.filter((city) => {
					return city.name.toLowerCase().includes(query.toLowerCase())
			  })

	return (
		<Combobox
			as='div'
			value={selectedCity}
			onChange={(city) => {
				setQuery('')
				setSelectedCity(city)
				onCityChange(city)
			}}>
			{/* <Label className='block text-sm font-medium leading-6 text-gray-900'>Assigned to</Label> */}
			<div className='relative mt-2'>
				<ComboboxInput
					className='text-2xl font-extrabold w-full bg-white py-1.5 pl-3 pr-10 text-black border-b-2 border-black focus:border-indigo-600'
					onChange={(event) => setQuery(event.target.value)}
					onBlur={() => setQuery('')}
					autoFocus={true}
					displayValue={(city) => city?.name}
				/>
				{/* <ComboboxButton className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
					<ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
				</ComboboxButton> */}

				{filteredCities.length > 0 && (
					<ComboboxOptions className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
						{filteredCities.map((city) => (
							<ComboboxOption
								key={city.name}
								value={city}
								className='group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-indigo-600 data-[focus]:text-white'>
								<span className='block truncate group-data-[selected]:font-semibold'>
									{city.name}
								</span>

								<span className='absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white'>
									<CheckIcon className='h-5 w-5' aria-hidden='true' />
								</span>
							</ComboboxOption>
						))}
					</ComboboxOptions>
				)}
			</div>
		</Combobox>
	)
}
