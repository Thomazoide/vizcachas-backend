import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Audit, OpType } from "../models/audit.model.js";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(Audit)
        private readonly repo: Repository<Audit>
    ){};

    async CreateAuditReport(newAuditReport: Partial<Audit>): Promise<Audit> {
        const saveResult = await this.repo.save(newAuditReport);
        return saveResult;
    }

    async GetAllAuditReports(): Promise<Audit[]> {
        return this.repo.find();
    }

    async GetSpecificAuditReports(report_type: OpType): Promise<Audit[]> {
        return this.repo.find({
            where: {
                operation_type: report_type
            }
        });
    }
};