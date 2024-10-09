export default function Index() {
	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-3xl font-serif italic p-4'>Props come in all shapes and sizes!</h1>
			<p className='text-sm px-4 py-2'>
				This year, there are three types you should know about.
			</p>
			<h2 className='text-xl font-semibold px-4 pt-4'>1. Initiatives</h2>
			<p className='text-sm px-4 py-2'>
				Initiatives are proposed laws or statutes placed on the ballot by citizens. They require
				a certain number of voter signatures to qualify and, if passed, can be changed by the
				legislature (with some restrictions).
			</p>
			<h2 className='text-xl font-semibold px-4 pt-4'>2. Amendments</h2>
			<p className='text-sm px-4 py-2'>
				These propositions aim to change California's constitution. They can be placed on the
				ballot by the legislature or through the initiative process with more signatures
				required. If passed, they can only be changed by another ballot measure.
			</p>
			<h2 className='text-xl font-semibold px-4 pt-4'>3. Bonds</h2>
			<p className='text-sm px-4 py-2'>
				Bond measures ask voters to approve the state taking on debt to fund specific projects,
				usually related to infrastructure or public works. They're typically placed on the
				ballot by the legislature.
			</p>
		</div>
	)
}
