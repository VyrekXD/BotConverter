import { ConverterClient } from '../Classes/ConverterClient'

export const run = (Converter: ConverterClient): void => {
	console.log(`Client §2${Converter.user?.tag}§f is ready`)

	const Statuses = [
		'files to convert.',
		`${Converter.users.cache.size} users aprox.`
	]

	setInterval(() => {
		const Status = Statuses[Math.floor(Math.random() * Statuses.length)]
		Converter.user?.setPresence({
			status: 'dnd',
			activities: [{ name: Status, type: 'WATCHING' }]
		})
	}, 40000)
}
