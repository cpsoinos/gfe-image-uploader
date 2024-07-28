CREATE TABLE `profileImage` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	`size` integer NOT NULL,
	`format` text NOT NULL,
	`crop` text,
	`transformations` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
