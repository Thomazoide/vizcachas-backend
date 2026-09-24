import { Controller, Get, HttpStatus, Param } from "@nestjs/common";
import { AuditService } from "./audit.service.js";
import { ResponsePayload } from "../payloads/response.payloads.js";
import { Audit, OpType } from "../models/audit.model.js";

@Controller("audit")
export class AuditController {
    constructor(
        private readonly service: AuditService
    ){};

    @Get()
    async GetAllAudits(): Promise<ResponsePayload<Audit[]>> {
        try {
            return {
                status_code: HttpStatus.OK,
                message: "Informe de auditoría general",
                data: await this.service.GetAllAuditReports(),
                error: false
            };
        } catch (e) {
            return {
                status_code: HttpStatus.BAD_REQUEST,
                message: e instanceof Error ? e.message : "Error desconocido",
                error: true
            };
        }
    }

    @Get(":optype")
    async GetSpecificAuditReports(
        @Param("optype")
        audit_type: string
    ): Promise<ResponsePayload<Audit[]>> {
        try {
            return {
                status_code: HttpStatus.OK,
                message: `Informes de auditoría para \"${audit_type}\"`,
                data: await this.service.GetSpecificAuditReports(audit_type as OpType),
                error: false
            };
        } catch (e) {
            return {
                status_code: HttpStatus.BAD_REQUEST,
                message: e instanceof Error ? e.message : "Error desconocido",
                error: true
            };
        }
    }
}