import { Request, Response } from "express";
import { Resource } from "../models/Resource";
import { v4 as uuidv4 } from "uuid";
import { s3 } from "../utils/aws";

export const createResource = async (
  req: Request,
  res: Response
): Promise<any> => {
  const user_id = (req as any).userId;
  const file = (req as any).file;

  if (!file) {
    return res.status(400).json({ error: "No file provided" });
  }

  try {
    const fileKey = `resources/${uuidv4()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    const EXPIRATION_TIME = req.body.expiration_time || 1000 * 60 * 60 * 24;
    const uploadResult = await s3.upload(params).promise();
    const resource = await Resource.create({
      resourceUrl: uploadResult.Location,
      expirationTime: new Date(Date.now() + EXPIRATION_TIME),
      user_id,
      access_token: uuidv4(),
    });

    res.status(201).json({
      message: "Resource uploaded successfully",
      resource,
    });
  } catch (error) {
    console.error("Error uploading file to S3", error);
    res.status(500).json({ error: "Error uploading Resource" });
  }
};

export const getResourceById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const user_id = (req as any).userId;

  try {
    const resource = await Resource.findOne({
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

    if ((resource as any).expiration_time < new Date()) {
      return res.status(410).json({ error: "Resource has expired" });
    }

    const URL_EXPIRATION = 60 * 5;

    const signedUrlParams = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: (resource as any).resource_url.split("/").slice(-1)[0],
      Expires: URL_EXPIRATION,
    };

    const signedUrl = s3.getSignedUrl("getObject", signedUrlParams);

    res.status(200).json({ signedUrl });
  } catch (error) {
    console.error("Error generating signed URL", error);
    res.status(500).json({ error: "Error generating URL" });
  }
};

export const getResources = async (req: Request, res: Response) => {
  const user_id = (req as any).userId;
  const status = req.query.status as string;

  try {
    const where: any = { user_id };
    if (status === "active") where.is_expired = false;
    else if (status === "expired") where.is_expired = true;

    const resources = await Resource.findAll({ where });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

export const deleteResource = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;
  const user_id = (req as any).userId;

  try {
    const resource = await Resource.findOne({
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

    await resource.destroy();

    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete resource" });
  }
};
