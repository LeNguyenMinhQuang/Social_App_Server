import { FilesService } from './files.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { join } from 'path';
import fs from 'fs';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    constructor() {}
    getRootPath() {
        return process.cwd();
    }

    ensureExists(targetDirectory: string) {
        return new Promise<void>((resolve, reject) => {
            fs.mkdir(targetDirectory, { recursive: true }, (error) => {
                if (error) {
                    if (error.code === 'EEXIST') {
                        resolve(); // Thư mục đã tồn tại
                    } else {
                        console.error('Error creating directory:', error);
                        reject(error);
                    }
                } else {
                    console.log('Directory successfully created, or it already exists');
                    resolve();
                }
            });
        });
    }

    uploadImageValidator(file) {
        // const allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'];
        const allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = file.originalname.split('.').pop()?.toLocaleLowerCase() as string;
        const isValidFileType = allowedFileTypes.includes(fileExtension);
        return isValidFileType;
    }

    createMulterOptions(): Promise<MulterModuleOptions> | MulterModuleOptions {
        console.log('upload');
        return {
            storage: diskStorage({
                destination: async (req, file, cb) => {
                    const folder = req?.headers?.folder_type ?? 'default';
                    const targetDir = join(this.getRootPath(), `public/images/${folder}`);
                    await this.ensureExists(`public/images/${folder}`);
                    cb(null, targetDir);
                },
                filename: (req, file, cb) => {
                    // @ts-ignore
                    let userId = req.user._id;
                    let extName = path.extname(file.originalname);
                    let baseName = path.basename(file.originalname, extName);
                    let finalName = `${baseName}-${userId}-${Date.now()}${extName}`;
                    cb(null, finalName);
                },
            }),
            fileFilter: (req, file, cb) => {
                const isValidFileType = this.uploadImageValidator(file);
                if (!isValidFileType) {
                    cb(new HttpException('Invalid file type', HttpStatus.UNPROCESSABLE_ENTITY), false);
                } else {
                    cb(null, true);
                }
            },
            limits: {
                fileSize: 50 * 1024 * 1024, // 10MB
                files: 5,
            },
            // // Thêm option này để preserve original filename behavior
            // preservePath: false,
        };
    }
}
