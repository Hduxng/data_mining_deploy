import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap } from "lucide-react";

const About = () => {
  const teamMembers = [
    { name: "A", studentId: "2352xxxx" },
    { name: "B", studentId: "2352xxxx" },
    { name: "C", studentId: "22352xxxx" },
    { name: "D", studentId: "2352xxxx" },
    { name: "E", studentId: "22352xxxx" },
    { name: "F", studentId: "2352xxxx" },
    { name: "G", studentId: "22352xxxx" },
    { name: "H", studentId: "2352xxxx" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2 animate-fade-in text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">Our Team</h1>
          <p className="text-muted-foreground text-lg">
            Meet the talented members behind this project
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card 
              key={index} 
              className="gradient-card border-border/50 hover:shadow-glow transition-all duration-300 hover:scale-105 group cursor-pointer"
            >
              <CardContent className="p-6">
                {/* Avatar */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                  <span className="text-2xl font-bold text-primary">
                    {member.name.split(' ').pop()?.[0]}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-xl font-semibold text-center mb-2 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>

                {/* Student ID */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span className="font-mono text-sm">{member.studentId}</span>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-primary/20 group-hover:bg-primary/40 transition-colors"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-secondary/20 group-hover:bg-secondary/40 transition-colors"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Stats */}
        <Card className="gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Users className="w-5 h-5 text-primary" />
              Team Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{teamMembers.length}</div>
                <div className="text-sm text-muted-foreground">Total Members</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-secondary">8</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-accent">100%</div>
                <div className="text-sm text-muted-foreground">Dedication</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">1</div>
                <div className="text-sm text-muted-foreground">Amazing Project</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;