"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResource = exports.getResources = exports.getResourceById = exports.createResource = void 0;
const Resource_1 = require("../models/Resource");
const uuid_1 = require("uuid");
const aws_1 = require("../utils/aws");
const createResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.userId;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: "No file provided" });
    }
    try {
        const fileKey = `resources/${(0, uuid_1.v4)()}-${file.originalname}`;
        const params = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read",
        };
        const EXPIRATION_TIME = req.body.expiration_time || 1000 * 60 * 60 * 24;
        const uploadResult = yield aws_1.s3.upload(params).promise();
        const resource = yield Resource_1.Resource.create({
            resourceUrl: uploadResult.Location,
            expirationTime: new Date(Date.now() + EXPIRATION_TIME),
            user_id,
            access_token: (0, uuid_1.v4)(),
        });
        res.status(201).json({
            message: "Resource uploaded successfully",
            resource,
        });
    }
    catch (error) {
        console.error("Error uploading file to S3", error);
        res.status(500).json({ error: "Error uploading Resource" });
    }
});
exports.createResource = createResource;
const getResourceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user_id = req.userId;
    try {
        const resource = yield Resource_1.Resource.findOne({
            where: {
                id,
                user_id,
            },
        });
        if (!resource) {
            return res
                .status(404)
                .json({ error: "Resource not found or not owned by user" });
        }
        if (resource.expiration_time < new Date()) {
            return res.status(410).json({ error: "Resource has expired" });
        }
        const URL_EXPIRATION = 60 * 5;
        const signedUrlParams = {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: resource.resource_url.split("/").slice(-1)[0],
            Expires: URL_EXPIRATION,
        };
        const signedUrl = aws_1.s3.getSignedUrl("getObject", signedUrlParams);
        res.status(200).json({ signedUrl });
    }
    catch (error) {
        console.error("Error generating signed URL", error);
        res.status(500).json({ error: "Error generating URL" });
    }
});
exports.getResourceById = getResourceById;
const getResources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = req.userId;
    const status = req.query.status;
    try {
        const where = { user_id };
        if (status === "active")
            where.is_expired = false;
        else if (status === "expired")
            where.is_expired = true;
        const resources = yield Resource_1.Resource.findAll({ where });
        res.status(200).json(resources);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getResources = getResources;
const deleteResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user_id = req.userId;
    try {
        const resource = yield Resource_1.Resource.findOne({
            where: {
                id,
                user_id,
            },
        });
        if (!resource) {
            return res
                .status(404)
                .json({ error: "Resource not found or not owned by user" });
        }
        yield resource.destroy();
        res.status(200).json({ message: "Resource deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete resource" });
    }
});
exports.deleteResource = deleteResource;
