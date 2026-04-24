const prisma = require("../db/prisma");
const { triageBug } = require("../services/claudeService");

// POST /api/bugs — submit a bug and trigger AI triage
async function submitBug(req, res) {
  try {
    const { title, description, submittedBy } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "title and description are required" });
    }

    // Save bug to DB first
    const bug = await prisma.bug.create({
      data: { title, description, submittedBy: submittedBy || null },
    });

    // Call Claude for triage
    const triage = await triageBug(title, description);

    // Update bug with triage results
    const triaged = await prisma.bug.update({
      where: { id: bug.id },
      data: {
        severity: triage.severity,
        category: triage.category,
        rootCause: triage.rootCause,
        suggestedFix: triage.suggestedFix,
        testCases: JSON.stringify(triage.testCases),
        triaged: true,
      },
    });

    return res.status(201).json({
      message: "Bug submitted and triaged successfully",
      bug: {
        ...triaged,
        testCases: JSON.parse(triaged.testCases),
      },
    });
  } catch (err) {
    console.error("submitBug error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// GET /api/bugs — fetch all bugs
async function getAllBugs(req, res) {
  try {
    const bugs = await prisma.bug.findMany({
      orderBy: { createdAt: "desc" },
    });

    const parsed = bugs.map((b) => ({
      ...b,
      testCases: b.testCases ? JSON.parse(b.testCases) : [],
    }));

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("getAllBugs error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// GET /api/bugs/:id — fetch single bug
async function getBugById(req, res) {
  try {
    const { id } = req.params;

    const bug = await prisma.bug.findUnique({ where: { id } });

    if (!bug) {
      return res.status(404).json({ error: "Bug not found" });
    }

    return res.status(200).json({
      ...bug,
      testCases: bug.testCases ? JSON.parse(bug.testCases) : [],
    });
  } catch (err) {
    console.error("getBugById error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { submitBug, getAllBugs, getBugById };