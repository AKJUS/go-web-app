import { listToGroupList } from '@togglecorp/fujs';
import { getMigrationFilesAttrs } from '../utils';

async function lintMigrations(projectPath: string, path: string) {
    const migrationFileAttrs = await getMigrationFilesAttrs(projectPath, path);
    console.info(`Found ${migrationFileAttrs.length} migration files.`);

    const migrationGroups = listToGroupList(
        migrationFileAttrs,
        ({ migrationName }) => migrationName,
    );

    const duplicates = Object.values(migrationGroups).filter((group) => group.length > 1);

    if (duplicates.length > 0) {
        const duplicateStr = duplicates.map((duplicate) => (
            duplicate.map(({ migrationName }) => migrationName).join(' <> ')
        )).join('\n');

        console.info(duplicateStr);

        throw `Error: found divirging migrations!`;
    }

    console.info('All good! No divirging migrations!');
}

export default lintMigrations;
