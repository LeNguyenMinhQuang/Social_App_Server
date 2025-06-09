import { BadRequestException, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { Message } from 'src/decorator/customize';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Message('Upload image')
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('File not invalid');
        }
        return {
            data: file.filename,
        };
    }

    @Message('Upload images')
    @Post('multi_upload')
    @UseInterceptors(FilesInterceptor('files'))
    uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
        if (!files) {
            throw new BadRequestException('Files not invalid');
        }
        const fileNames = files.map((file) => file.filename);
        return {
            data: fileNames,
        };
    }
}
