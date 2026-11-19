import { Stream } from 'node:stream';

export default async function stream2buffer(stream: Stream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const _buf: Buffer[] = [];
        stream.on("data", (chunk: Buffer) => {
            _buf.push(chunk);
        });
        stream.on("end", () => {
            resolve(Buffer.concat(_buf));
        });
        stream.on("error", (err: Error) => {
            reject(new Error(`error converting stream - ${err}`));
        });
    });
}
