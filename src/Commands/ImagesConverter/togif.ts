import { MessageAttachment } from 'discord.js'
import { ConverterContext } from '../../Classes/ConverterContext.js'
import { Command } from '../../Classes/Command.js'
import { ConverterClient } from '../../Classes/ConverterClient.js'
import Converters from '../../Classes/Converters.js'
import { GetURL } from '../../Lib/GetURL.js'

export default class togifCommand extends Command {
	constructor(client: ConverterClient) {
		super(client, {
			name: 'togif',
			description:
				'Converts an image to gif. (This command does **NOT** resize images)',
			category: 'images',
			usage: (prefix) =>
				`${prefix}togif <url/emoji/attachment/user/guildID> [--name <Image Name>]`,
			example: (prefix) =>
				`${prefix}togif https://vyrekxd.is-inside.me/CydkJGdZ.png\n${prefix}emojify :_XD:\n${prefix}emojify :_XD: --name my-gif\n${prefix}emojify <attach an image>\n${prefix}emojify @Vyrek\n${prefix}emojify 761370919419117598`
		})
	}

	async run(ctx: ConverterContext): Promise<any> {
		if (!ctx.args[0])
			return ctx.embedRes(
				`Incorrect use: \`${(this.usage as any)(
					ctx.constants.Client.prefix as any
				)}\``,
				'error'
			)

		const Src = await GetURL(ctx)
		if (!Src) return ctx.embedRes('You need to put a valid link', 'error')

		const Name =
			ctx.args[1] === '--name' ? ctx.args[2] ?? 'my-gif' : 'my-gif'
		const { buffer } = await Converters.GetImageBuffer(Src)
		const Attachment = new MessageAttachment(buffer, `${Name}.gif`)

		await ctx.send({ files: [Attachment] })
	}
}
