import { db } from '../lib/db/connection'
import { organizations, projects, documents, tasks } from '../lib/db/schema'
import { sql } from 'drizzle-orm'

async function viewData() {
  console.log('📊 VIEWING DATABASE DATA\n')
  
  try {
    // Organizations
    const orgs = await db.select().from(organizations)
    console.log('🏢 ORGANIZATIONS:')
    if (orgs.length > 0) {
      orgs.forEach(org => console.log(`  - ${org.name} (${org.id})`))
    } else {
      console.log('  (empty)')
    }
    
    // Projects
    const projs = await db.select().from(projects).limit(10)
    console.log(`\n📁 PROJECTS (showing first ${projs.length}):`)
    if (projs.length > 0) {
      projs.forEach(p => console.log(`  - ${p.name} | Client: ${p.clientName} | Status: ${p.status}`))
    } else {
      console.log('  (empty)')
    }
    
    // Documents
    const docs = await db.select().from(documents).limit(10)
    console.log(`\n📄 DOCUMENTS (showing first ${docs.length}):`)
    if (docs.length > 0) {
      docs.forEach(d => console.log(`  - ${d.title} | Category: ${d.category}`))
    } else {
      console.log('  (empty)')
    }
    
    // Tasks
    const tsk = await db.select().from(tasks).limit(10)
    console.log(`\n✅ TASKS (showing first ${tsk.length}):`)
    if (tsk.length > 0) {
      tsk.forEach(t => console.log(`  - ${t.title} | Status: ${t.status} | Priority: ${t.priority}`))
    } else {
      console.log('  (empty)')
    }
    
    // Counts using SQL
    const [orgCount] = await db.execute(sql`SELECT COUNT(*) as count FROM ${organizations}`)
    const [projCount] = await db.execute(sql`SELECT COUNT(*) as count FROM ${projects}`)
    const [docCount] = await db.execute(sql`SELECT COUNT(*) as count FROM ${documents}`)
    const [taskCount] = await db.execute(sql`SELECT COUNT(*) as count FROM ${tasks}`)
    
    console.log('\n📈 SUMMARY:')
    console.log(`  Organizations: ${(orgCount as any).count}`)
    console.log(`  Projects: ${(projCount as any).count}`)
    console.log(`  Documents: ${(docCount as any).count}`)
    console.log(`  Tasks: ${(taskCount as any).count}\n`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    process.exit(0)
  }
}

viewData()

