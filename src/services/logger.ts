
import winston from 'winston'
import fs from 'fs'
import path from 'path'

const logPath = "./"
console.log(logPath)

if (logPath !== undefined && !fs.existsSync(logPath)) fs.mkdirSync(logPath)
export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(winston.format.prettyPrint(), winston.format.timestamp()),
  transports: [new winston.transports.File({
    filename: path.join(logPath, 'errors.log'),
    level: 'error'
  }),
  new winston.transports.File({ filename: path.join(logPath, 'debug.log') })]

})

if (process.env.ENVIROMENT !== 'PRODUCTION') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.prettyPrint(),
      winston.format.colorize({ all: true }),
      winston.format.timestamp())
  }))
}