ALTER TABLE `profileImage` RENAME TO `profile_images`;--> statement-breakpoint
ALTER TABLE `profile_images` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
DROP INDEX IF EXISTS `userId_name_idx`;--> statement-breakpoint
DROP INDEX IF EXISTS `selected_by_user_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `userId_name_idx` ON `profile_images` (`user_id`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `selected_by_user_idx` ON `profile_images` (`user_id`,`selected`) WHERE profile_images.selected = 1;