import Job, { IJob } from "../db/jobModel";
import User, { IUser } from "../db/userModel";
import { Request, Response } from "express";
import Category, { ICategory } from "../db/categoryModel";
import Interest, { IInterest } from "../db/interestModel";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { jwtDecode } from "jwt-decode";

dotenv.config();
const service = process.env.MAIL_SERVICE;
const mail_user = process.env.MYEMAIL;
const mail_pass = process.env.MYPASS;

interface myToken {
  userId: string;
  iat: number;
  exp: number;
}

const JobController = {
  // ... (other methods)

  // Controller method for creating a new job
  createJob: async (req: Request, res: Response) => {
    try {
      const { title, description, categories } = req.body;

      if (!title || !description || !categories) {
        return res.status(400).json({ message: "All fields required" });
      }

      // Assuming categories is an array of category names
      const categoryChecks = await Promise.all(
        categories.map(async (categoryName: string) => {
          return await Category.findOne({ name: categoryName });
        })
      );

      // Check if any of the categories don't exist
      if (categoryChecks.some((categoryCheck) => !categoryCheck)) {
        return res
          .status(400)
          .json({ message: "One or more categories do not exist" });
      }

      const token = req.cookies.accessToken;
      const tokenUser = jwtDecode<myToken>(token);
      if (!tokenUser) {
        return res.json({ message: "Invalid Token Login Again" });
      }

      const _id = tokenUser.userId;

      // Create a new job
      const createNewJob: IJob = await Job.create({
        title,
        description,
        categories,
        creator: _id,
      });

      await createNewJob.save();

      // Notify interested users by sending emails
      const interestedUsers: IInterest[] = await Interest.find({ categories });

      // Assuming you have an email service configured
      const transporter = nodemailer.createTransport({
        // Specify your email service configuration (SMTP, OAuth, etc.)
        // See Nodemailer documentation for details: https://nodemailer.com/about/
        service: service,
        auth: {
          user: mail_user,
          pass: mail_pass,
        },
      });

      // const jobLink = `https://yourjobwebsite.com/jobs/${createNewJob._id}`; // Replace with the actual URL

      // Send emails to interested users
      for (const user of interestedUsers) {
        const mailOptions = {
          from: mail_user,
          to: user.email,
          subject: "New Job Notification",
          text: `A new job "${createNewJob.title}" has been posted in the category "${categories}". Check it out:`,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }

      res.status(200).json({ message: "New Job created", createNewJob });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Controller method for applying for a job
  applyForJob: async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      const coverLetter = req.body.coverLetter;

      const token = req.cookies.accessToken;
      const tokenUser = jwtDecode<myToken>(token);
      if (!tokenUser) {
        return res.json({ message: "Invalid Token Login Again" });
      }

      const _id = tokenUser.userId;

      // Check if the job and user exist
      const job = await Job.findById(jobId);
      const user = await User.findById(_id);

      if (!job || !user) {
        return res.status(404).json({ error: "Job or user not found" });
      }

      // Check if the user is the creator of the job
      if (job.creator === _id) {
        return res
          .status(403)
          .json({ error: "Creator cannot apply for their own job" });
      }

      // Check if the user has already applied for this job
      if (job.applications.some((app) => app.userId === _id)) {
        return res
          .status(400)
          .json({ error: "User has already applied for this job" });
      }

      // Add the user to the job's applications array
      job.applications.push({ userId: _id, coverLetter });
      await job.save();

      // Send a success response
      res.status(200).json({ message: "Application submitted successfully" });
    } catch (error) {
      // Handle application errors
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Controller method to get all job applications for a job
  getJobApplications: async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;

      // Check if the job exists
      const job = await Job.findById(jobId);

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      const token = req.cookies.accessToken;
      const tokenUser = jwtDecode<myToken>(token);
      if (!tokenUser) {
        return res.json({ message: "Invalid Token Login Again" });
      }

      const _id = tokenUser.userId;
      if (job.creator === _id) {
        // Retrieve user details for each applicant
        const applicants = await Promise.all(
          job.applications.map(async (application) => {
            // const user = await User.findById(application.userId);
            return { application };
          })
        );

        // Send the list of applicants as the response
        res.status(200).json({ applicants });
      } else {
        // If not the creator, return a forbidden error
        res.status(403).json({ error: "Permission denied" });
      }
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Additional controller methods can be added for updating jobs, retrieving job details, etc.
};

export default JobController;
