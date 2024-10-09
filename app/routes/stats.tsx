import { json, LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface VoteCount {
	yes: number
	no: number
	undecided: number
}

interface PropStats {
	letter: string
	title: string
	votes: VoteCount
}

interface Env {
	MAD_PROPS_DATA: KVNamespace
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
	const { env } = context.cloudflare as { env: Env }

	// Fetch all keys from the KV store
	const keys = await env.MAD_PROPS_DATA.list()

	// Initialize vote counts for each proposition
	const propStats: { [key: string]: VoteCount } = {}

	// Count votes
	for (const key of keys.keys) {
		const votesJson = await env.MAD_PROPS_DATA.get(key.name)
		if (votesJson) {
			const votes = JSON.parse(votesJson)
			for (const [propName, vote] of Object.entries(votes)) {
				if (!propStats[propName]) {
					propStats[propName] = { yes: 0, no: 0, undecided: 0 }
				}
				propStats[propName][vote as keyof VoteCount]++
			}
		}
	}

	// Convert to array and add titles
	const statsArray: PropStats[] = Object.entries(propStats).map(([propName, votes]) => ({
		title: `Proposition ${propName.split('-')[1]}`,
		votes
	}))

	return json({ stats: statsArray })
}

export default function Stats() {
	const { stats } = useLoaderData<typeof loader>()

	const COLORS = ['#00C49F', '#FF444A', '#AAAAAA']

	return (
		<div className='max-w-4xl mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-8'>California Propositions Voting Statistics</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
				{stats.map((prop) => {
					const total = prop.votes.yes + prop.votes.no + prop.votes.undecided
					const data = [
						{ name: 'Yes', value: prop.votes.yes },
						{ name: 'No', value: prop.votes.no },
						{ name: 'Undecided', value: prop.votes.undecided }
					]

					return (
						<div key={prop.letter} className='bg-white p-4 rounded shadow'>
							<h2 className='text-xl font-semibold mb-4'>{prop.title}</h2>

							<ResponsiveContainer width='100%' height={200}>
								<PieChart>
									<Pie
										data={data}
										cx='50%'
										cy='50%'
										innerRadius={60}
										outerRadius={80}
										paddingAngle={0}
										dataKey='value'>
										{data.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index]} />
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
							<div className='mt-4'>
								<p>Total Votes: {total}</p>
								<p>
									Yes: {prop.votes.yes} ({((prop.votes.yes / total) * 100).toFixed(1)}%)
								</p>
								<p>
									No: {prop.votes.no} ({((prop.votes.no / total) * 100).toFixed(1)}%)
								</p>
								<p>
									Undecided: {prop.votes.undecided} (
									{((prop.votes.undecided / total) * 100).toFixed(1)}%)
								</p>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
