ALTER TABLE `rc`.`managers` 
ADD COLUMN `id` INT NOT NULL AUTO_INCREMENT FIRST,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`id`, `discord_id`);
;

DELETE FROM members WHERE num = 3118;
DELETE FROM rts WHERE in_game_id = 98634;
DELETE FROM pigs WHERE in_game_id = 98634;
DELETE FROM rts WHERE in_game_id = 140155;
DELETE FROM pigs WHERE in_game_id = 140155;
DELETE FROM payout WHERE player_id = 140155;
DELETE FROM rts WHERE in_game_id = 171017;
DELETE FROM pigs WHERE in_game_id = 171017;
DELETE FROM payout WHERE player_id = 171017;
DELETE FROM rts WHERE in_game_id = 222222;
DELETE FROM pigs WHERE in_game_id = 222222;
DELETE FROM payout WHERE player_id = 222222;
DELETE FROM rts WHERE in_game_id = 246852;
DELETE FROM pigs WHERE in_game_id = 246852;
DELETE FROM rts WHERE in_game_id = 304609;
DELETE FROM pigs WHERE in_game_id = 304609;
DELETE FROM rts WHERE in_game_id = 316944;
DELETE FROM pigs WHERE in_game_id = 316944;
DELETE FROM payout WHERE player_id = 316944;
DELETE FROM rts WHERE in_game_id = 333333;
DELETE FROM pigs WHERE in_game_id = 333333;
DELETE FROM payout WHERE player_id = 333333;
DELETE FROM rts WHERE in_game_id = 400000;
DELETE FROM pigs WHERE in_game_id = 400000;
DELETE FROM payout WHERE player_id = 400000;
DELETE FROM payout WHERE player_id = 229276;
DELETE FROM payout WHERE player_id = 258751;

INSERT INTO managers (discord_id, rts_cashout, total_money, rts_cashout_worth, pigs_cashout, pigs_cashout_worth, active) VALUES ('143434597026234368', 2934, 13204000, 29340000, 0, 0, 0);

-- SELECT * FROM members m WHERE m.in_game_id IN (SELECT in_game_id FROM members WHERE members.id != m.id);
-- SELECT * FROM rts WHERE rts.in_game_id NOT IN (SELECT in_game_id FROM members);
-- SELECT * FROM pigs WHERE pigs.in_game_id NOT IN (SELECT in_game_id FROM members);
-- SELECT * FROM payout WHERE payout.manager_id NOT IN (SELECT discord_id FROM managers);
-- SELECT * FROM payout WHERE payout.player_id NOT IN (SELECT in_game_id FROM members);

UPDATE rts SET in_game_id = (SELECT num FROM members WHERE rts.in_game_id = members.in_game_id);
UPDATE pigs SET in_game_id = (SELECT num FROM members WHERE pigs.in_game_id = members.in_game_id);
UPDATE payout SET manager_id = (SELECT id FROM managers WHERE payout.manager_id = managers.discord_id);
UPDATE payout SET player_id = (SELECT num FROM members WHERE payout.player_id = members.in_game_id);
UPDATE managers SET discord_id = (SELECT num FROM members WHERE managers.discord_id = members.discord_id);

-- Applications
ALTER TABLE applications 
RENAME COLUMN reason TO status_info,
RENAME COLUMN app_id TO id,
ADD COLUMN `createdAt` DATETIME NOT NULL AFTER `paid`,
ADD COLUMN `updatedAt` DATETIME NOT NULL AFTER `createdAt`;

UPDATE applications SET createdAt = time;
ALTER TABLE applications DROP COLUMN `time`;

-- Members
ALTER TABLE `rc`.`members` 
CHANGE COLUMN `num` `id` INT NOT NULL AUTO_INCREMENT FIRST,
CHANGE COLUMN `in_game_id` `in_game_id` INT NOT NULL AFTER `in_game_name`,
CHANGE COLUMN `deadline` `deadline` DATETIME NOT NULL ,
CHANGE COLUMN `fire_reason` `fire_reason` TEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NULL DEFAULT NULL ,
CHANGE COLUMN `last_turnin` `last_turnin` DATETIME NOT NULL,
ADD UNIQUE INDEX `in_game_id_UNIQUE` (`in_game_id` ASC) VISIBLE,
ADD COLUMN `createdAt` DATETIME NOT NULL AFTER `welcome`,
ADD COLUMN `updatedAt` DATETIME NOT NULL AFTER `createdAt`;

-- Website
ALTER TABLE `rc`.`website` 
CHANGE COLUMN `num` `id` INT NOT NULL AUTO_INCREMENT FIRST,
ADD COLUMN `createdAt` DATETIME NOT NULL AFTER `permission`,
ADD COLUMN `updatedAt` DATETIME NOT NULL AFTER `createdAt`;

-- rts
ALTER TABLE `rc`.`rts` 
ADD COLUMN `id` INT NOT NULL AUTO_INCREMENT FIRST,
CHANGE COLUMN `in_game_id` `member_id` INT NOT NULL ,
CHANGE COLUMN `rts_total_vouchers` `vouchers` BIGINT NOT NULL DEFAULT '0' ,
CHANGE COLUMN `rts_total_money` `worth` BIGINT NOT NULL DEFAULT '0' ,
ADD UNIQUE INDEX `member_id_UNIQUE` (`member_id` ASC) VISIBLE,
ADD COLUMN `createdAt` DATETIME NOT NULL AFTER `worth`,
ADD COLUMN `updatedAt` DATETIME NOT NULL AFTER `createdAt`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`id`),
ADD INDEX `Member_idx` (`member_id` ASC) VISIBLE;
;
ALTER TABLE `rc`.`rts` 
ADD CONSTRAINT `RTS Member`
  FOREIGN KEY (`member_id`)
  REFERENCES `rc`.`members` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

-- pigs
ALTER TABLE `rc`.`pigs` 
ADD COLUMN `id` INT NOT NULL AUTO_INCREMENT FIRST,
CHANGE COLUMN `in_game_id` `member_id` INT NOT NULL ,
CHANGE COLUMN `pigs_total_vouchers` `vouchers` BIGINT NOT NULL DEFAULT '0' ,
CHANGE COLUMN `pigs_total_money` `worth` BIGINT NOT NULL DEFAULT '0' ,
ADD UNIQUE INDEX `member_id_UNIQUE` (`member_id` ASC) VISIBLE,
ADD COLUMN `createdAt` DATETIME NOT NULL AFTER `worth`,
ADD COLUMN `updatedAt` DATETIME NOT NULL AFTER `createdAt`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`id`),
ADD INDEX `Member_idx` (`member_id` ASC) VISIBLE;
;
ALTER TABLE `rc`.`pigs` 
ADD CONSTRAINT `PIGS Member`
  FOREIGN KEY (`member_id`)
  REFERENCES `rc`.`members` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

-- managers
ALTER TABLE `rc`.`managers` 
CHANGE COLUMN `total_money` `total_money` BIGINT NOT NULL DEFAULT '0' AFTER `pigs_cashout_worth`,
CHANGE COLUMN `discord_id` `member_id` INT NOT NULL ,
ADD UNIQUE INDEX `member_id_UNIQUE` (`member_id` ASC) VISIBLE,
ADD COLUMN `createdAt` DATETIME NOT NULL AFTER `active`,
ADD COLUMN `updatedAt` DATETIME NOT NULL AFTER `createdAt`,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`id`),
ADD INDEX `Member_idx` (`member_id` ASC) VISIBLE;
;
ALTER TABLE `rc`.`managers` 
ADD CONSTRAINT `Manager Member`
  FOREIGN KEY (`member_id`)
  REFERENCES `rc`.`members` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

-- payout
ALTER TABLE `rc`.`payout` 
CHANGE COLUMN `primary` `id` INT NOT NULL AUTO_INCREMENT FIRST,
CHANGE COLUMN `payed_money` `worth` BIGINT NOT NULL AFTER `amount`,
CHANGE COLUMN `manager_id` `manager_id` INT NOT NULL ,
CHANGE COLUMN `player_id` `member_id` INT NOT NULL ,
CHANGE COLUMN `current_company` `company` VARCHAR(5) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NOT NULL ,
CHANGE COLUMN `vouchers_turned_in` `amount` BIGINT NOT NULL ,
ADD COLUMN `createdAt` DATETIME NOT NULL AFTER `worth`,
ADD COLUMN `updatedAt` DATETIME NOT NULL AFTER `createdAt`,
ADD INDEX `Member_idx` (`member_id` ASC) VISIBLE;
;
ALTER TABLE `rc`.`payout` 
ADD CONSTRAINT `Payout Member`
  FOREIGN KEY (`member_id`)
  REFERENCES `rc`.`members` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `Payout Manager`
  FOREIGN KEY (`manager_id`)
  REFERENCES `rc`.`managers` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

UPDATE payout SET createdAt = time;
ALTER TABLE payout DROP COLUMN `time`;