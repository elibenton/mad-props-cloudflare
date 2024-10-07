import { Link } from '@remix-run/react'

function PropCard({
	prop,
	vote = 'undecided',
	onVote,
	index
}: {
	prop: Prop
	vote?: VoteState
	onVote: (newVote: VoteState) => void
	index: number
}) {
	const rotateDirection = index % 2 === 0 ? 'group-hover:rotate-6' : 'group-hover:-rotate-6'

	return (
		<div className='border-b-2 border-black -mx-4 py-5 px-4 overflow-hidden group relative flex flex-row justify-between'>
			<div className={` ${prop.imageUrl ? '-mr-16' : 'mr-0'} sm:mr-0`}>
				<Link
					to={`/${prop.location.toLowerCase()}/prop-${prop.letter.toLowerCase()}`}
					prefetch='intent'
					className='block group'>
					<h3 className='text-xl font-semibold mb-2 relative inline-block'>
						<span className='relative inline-block'>
							<span className='relative z-10'>
								<b>Prop {prop.letter}</b>
							</span>
							<span className='absolute inset-x-0 bottom-0 h-2 bg-yellow-200 origin-left transform scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100'></span>
						</span>{' '}
						{prop.title}
					</h3>
				</Link>
				{prop.type && (
					<Link to='/types'>
						<p className='text-xs bg-gray-100 text-gray-500 hover:bg-gray-300 hover:text-gray-600 duration-200 ease-out p-0.5 px-1.5 mb-4 rounded-lg inline-block'>
							{prop.type}
						</p>
					</Link>
				)}
				<p className='mb-6'>{prop.description}</p>
				<div className='space-x-2'>
					<button
						onClick={() => onVote('yes')}
						className={`z-10 border-2 border-green-500 font-sm px-2.5 py-1 rounded inline-block 
                ${vote === 'yes' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-500'}`}>
						Yes
					</button>
					<button
						onClick={() => onVote('no')}
						className={`z-10 border-2 border-red-500 font-sm px-2.5 py-1 rounded inline-block 
                ${vote === 'no' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500'}`}>
						No
					</button>
				</div>
			</div>
			<Link
				to={`/${prop.location.toLowerCase()}/prop-${prop.letter.toLowerCase()}`}
				prefetch='intent'
				className='relative flex-none -right-16 sm:right-0'>
				{prop.imageUrl && (
					<img
						src={prop.imageUrl}
						alt={`Prop ${prop.letter}`}
						className={`w-52 h-52 sm:w-72 sm:h-72 object-contain object-center p-1 transition-transform duration-300 ease-in-out ${rotateDirection}`}
					/>
				)}
			</Link>
		</div>
	)
}

export default PropCard
