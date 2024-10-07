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

const people = [
	{ id: 1, name: 'Durward Reynolds' },
	{ id: 2, name: 'Kenton Towne' },
	{ id: 3, name: 'Therese Wunsch' },
	{ id: 4, name: 'Benedict Kessler' },
	{ id: 5, name: 'Katelyn Rohan' }
]

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
			<div className='pt-2 relative'>
				<ComboboxInput
					aria-label='Assignee'
					className='relative w-full border-x-0 border-t-0 border-b-2 border-black focus:ring-0 focus:border-black px-4 -mx-4 text-xl font-bold'
					displayValue={(city) => city?.name}
					onChange={(event) => setQuery(event.target.value)}
					placeholder='Type to search...'
					autoFocus
				/>
				<ComboboxOptions className='absolute z-30 mt-1 max-h-60 w-full overflow-hidden bg-white p-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none '>
					{filteredCities.map((city) => (
						<ComboboxOption key={city.id} value={city} className='data-[focus]:bg-blue-100'>
							{city.name}
						</ComboboxOption>
					))}
				</ComboboxOptions>
				{query !== '' && filteredCities.length === 0 && (
					<p className='p-4 text-sm text-gray-500'>That city is not in our database.</p>
				)}
			</div>
		</Combobox>
	)
}
