import mediaExtractor from 'media-extractor'
import parser from 'twemoji-parser'
import { Guild } from 'discord.js'
import { ConverterContext } from '../Classes/ConverterContext'

export async function GetURL(ctx: ConverterContext): Promise<string> {
	//Copied from https://github.com/AndreMor8/gidget/blob/master/src/commands/image/emojify.js
	const UserOrGuild =
		ctx.args[0] || ctx.msg.mentions.users.first()
			? ctx.msg.mentions.users.first() ||
			  ctx.client.users.cache.get(ctx.args[0] as any) ||
			  ctx.client.users.cache.find(
					(e) =>
						e.username === ctx.args.slice(1).join(' ') ||
						e.tag === ctx.args.slice(1).join(' ') ||
						e.username?.toLowerCase() ===
							ctx.args.slice(1).join(' ')?.toLowerCase() ||
						e.tag?.toLowerCase() ===
							ctx.args.slice(1).join(' ')?.toLowerCase()
			  ) ||
			  ctx.guild?.members.cache.find(
					(e) =>
						e.nickname === ctx.args.slice(1).join(' ') ||
						e.nickname?.toLowerCase() ===
							ctx.args.slice(1).join(' ')?.toLowerCase()
			  )?.user ||
			  ctx.client.guilds.cache.get(ctx.args[0] as any) ||
			  (await ctx.client.users.fetch(ctx.args[0] as any).catch(() => {}))
			: null
	let Src: any

	if (UserOrGuild) {
		Src =
			UserOrGuild instanceof Guild
				? UserOrGuild.iconURL({
						format: 'png',
						dynamic: true,
						size: 64
				  })
				: UserOrGuild.displayAvatarURL({
						format: 'png',
						dynamic: true,
						size: 64
				  })
	} else if (ctx.msg.attachments.first()) {
		Src = ctx.msg.attachments.first()?.url
	} else if (ctx.args[0]?.match(/<?(a:|:)\w*:(\d{17}|\d{18})>/)) {
		const matched = ctx.args[0]?.match(/<?(a:|:)\w*:(\d{17}|\d{18})>/)
		const ext = ctx.args[0].startsWith('<a:') ? 'gif' : 'png'
		Src = `https://cdn.discordapp.com/emojis/${(matched as any)[2]}.${ext}`
	} else if (
		(/tenor\.com\/view/.test(ctx.args[0] as string) ||
			/tenor.com\/.+\.gif/.test(ctx.args[0] as string) ||
			/giphy\.com\/gifs/.test(ctx.args[0] as string)) &&
		(await mediaExtractor.resolve(ctx.args[0] as string))
	) {
		Src = await mediaExtractor.resolve(ctx.args[0] as string)
	} else if (
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)/gm.test(
			ctx.args[0] as string
		)
	) {
		Src = ctx.args[0]
	}

	const parsed = parser.parse(ctx.args[0] as string)
	if (parsed.length >= 1) {
		Src = parsed[0]?.url
	}

	return Src
}
