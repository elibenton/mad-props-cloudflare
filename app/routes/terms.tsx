export default function TermsPage() {
	return (
		<div className='container mx-auto p-4 font-sans'>
			<h1 className='text-3xl font-bold italic mb-12'>
				The "We're Not Evil, We Promise" Terms Page
			</h1>

			<section className='mb-6'>
				<h2 className='text-2xl font-semibold mb-2'>Welcome to the Least Boring Terms Ever!</h2>
				<p className='text-sm py-1'>
					Look, we know you'd rather watch paint dry than read terms, but stick with us. It'll
					be quick, painless, and might even make you chuckle.
				</p>
			</section>

			<section className='mb-6'>
				<h2 className='text-xl font-semibold mb-2'>
					We're Open Source (Because We Have Nothing to Hide)
				</h2>
				<p className='text-sm py-1'>
					Our code is more open than a 24/7 convenience store. Feel free to peek under the
					hood, suggest improvements, or fork us. Just don't fork us too hard, okay?
				</p>
			</section>

			<section className='mb-6'>
				<h2 className='text-xl font-semibold mb-2'>Data Collection (or Lack Thereof)</h2>
				<p className='text-sm py-1'>
					We collect less data than your grandma's flip phone. Just some anonymous tidbits to
					keep the lights on. Your secrets are safe with... well, you, because we don't want
					'em!
				</p>
			</section>

			<footer className='text-sm italic mt-8'>
				<p>If you've read this far, congratulations! You're officially our favorite user. 🏆</p>
				<p>Now go forth and enjoy the site, you terms-reading champion!</p>
			</footer>
		</div>
	)
}
