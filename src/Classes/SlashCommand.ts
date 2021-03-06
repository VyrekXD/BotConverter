import { GuildMember } from 'discord.js'
import { BaseCommand, SlashCommandOptions } from './BaseCommand.js'
import { ConverterClient } from './ConverterClient.js'
import { ConverterSlashContext } from './ConverterContext.js'

export class BaseSlashCommand extends BaseCommand {
	constructor(client: ConverterClient, options: SlashCommandOptions) {
		super(client, options)
	}

	canRun(context: ConverterSlashContext): any {
		const isDev = context.config.devs?.includes(context.user.id)

		if (!context.guild && this.onlyGuild) {
			return context
				.embedRes('This command can only runned in a guild!', 'error')
				.catch(() => true)
		} else if (this.dev && !isDev)
			return context.embedRes(
				'This command is only for developers',
				'error'
			)
		else if (!this.status && !isDev)
			return context.embedRes('This command is disabled', 'error')
		else if (this.GetCooldown(context)) {
			const Cooldown = this.cooldowns.get(context.user.id)
			if (!Cooldown) return true
			if (Cooldown.advised) return true

			const TimeLeft = ((Cooldown?.date as number) - Date.now()) / 1000

			Cooldown.advised = true
			return context.embedRes(
				`Tienes que esperar **${TimeLeft.toFixed(
					1
				)}s** para usar el comando`,
				'error'
			)
		} else if (this.botPermissions.length) {
			if (
				!this.botPermissions.some((x) =>
					context.guild?.me?.permissions.has(x)
				)
			) {
				return context.embedRes(
					`I need this permissions: \`${this.LostPermissions(
						this.botPermissions,
						context.guild?.me as GuildMember
					)}\``,
					'error'
				)
			} else if (this.botChannelPermissions.length) {
				return context.embedRes(
					`I need this permissions in this channel: \`${this.LostPermissions(
						this.botChannelPermissions,
						context.guild?.me as GuildMember,
						context.channel
					)}\``,
					'error'
				)
			}
		} else if (this.memberPermissions.length) {
			if (
				!this.memberPermissions.some((x) =>
					context.guild?.me?.permissions.has(x)
				)
			) {
				return context.embedRes(
					`You need this permissions: \`${this.LostPermissions(
						this.memberPermissions,
						context.guild?.me as GuildMember
					)}\``,
					'error'
				)
			} else if (this.memberChannelPermissions.length) {
				return context.embedRes(
					`You need this permissions in this channel: \`${this.LostPermissions(
						this.memberChannelPermissions,
						context.guild?.me as GuildMember,
						context.channel
					)}\``,
					'error'
				)
			}
		}

		return false
	}
}
