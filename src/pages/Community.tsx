import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, MapPin, Camera, Plus, X, Send, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Post {
  id: string;
  user_name: string;
  user_avatar: string;
  image_url: string;
  caption: string;
  location: string;
  likes: number;
  comments_count: number;
  created_at: string;
}

const mockPosts: Post[] = [
  {
    id: "p1",
    user_name: "Aditya Verma",
    user_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    image_url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
    caption: "The Taj Mahal at sunrise is a spiritual experience. Simply breathtaking! 🏛️✨",
    location: "Agra, India",
    likes: 1240,
    comments_count: 56,
    created_at: new Date().toISOString(),
  },
  {
    id: "p2",
    user_name: "Sanya Roy",
    user_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    image_url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    caption: "Backwaters of Kerala. Living on a houseboat is the ultimate peace. 🛶🌴",
    location: "Alleppey, Kerala",
    likes: 890,
    comments_count: 32,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "p3",
    user_name: "Ishaan Gupta",
    user_avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
    image_url: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
    caption: "Blue city vibes! Jodhpur never fails to amaze with its colors. 💙🏰",
    location: "Jodhpur, Rajasthan",
    likes: 1560,
    comments_count: 84,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  }
];

const Community = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPost, setNewPost] = useState({ caption: "", location: "", image: "" });

  useEffect(() => {
    // Simulate fetching from database
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Login Required", description: "You must be signed in to post." });
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      user_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Anonymous",
      user_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
      image_url: newPost.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
      caption: newPost.caption,
      location: newPost.location,
      likes: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
    };

    setPosts([post, ...posts]);
    setShowCreate(false);
    setNewPost({ caption: "", location: "", image: "" });
    toast({ title: "Experience Shared!", description: "Your post is now live in the community feed." });
  };

  return (
    <div className="min-h-screen bg-muted/40 pt-24 pb-20 sm:pb-12">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Header Area */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Community</h1>
            <p className="text-muted-foreground text-sm">Real experiences from fellow travelers</p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="rounded-full h-12 w-12 p-0 shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm group"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-border">
                    <img src={post.user_avatar} alt={post.user_name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-none">{post.user_name}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-[10px] mt-1">
                      <MapPin className="h-2 w-2" /> {post.location}
                    </div>
                  </div>
                </div>

                {/* Post Image */}
                <div className="relative aspect-square sm:aspect-video overflow-hidden bg-muted">
                  <img src={post.image_url} alt="Experience" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>

                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <button className="flex items-center gap-1.5 hover:text-accent transition-colors">
                      <Heart className="h-6 w-6" />
                      <span className="text-xs font-bold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <MessageCircle className="h-6 w-6" />
                      <span className="text-xs font-bold">{post.comments_count}</span>
                    </button>
                    <button className="ml-auto hover:text-primary transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="text-sm text-foreground mb-2">
                    <span className="font-bold mr-2">{post.user_name}</span>
                    {post.caption}
                  </p>
                  
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {new Date(post.created_at).toLocaleDateString("en-IN", { month: "long", day: "numeric" })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold font-display">Share Experience</h2>
                  <button onClick={() => setShowCreate(false)} className="p-2 rounded-full hover:bg-muted"><X className="h-5 w-5" /></button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-5">
                  <div className="space-y-4">
                    <div className="h-48 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 bg-muted/30 group hover:bg-muted/50 transition-colors cursor-pointer relative overflow-hidden">
                      {newPost.image ? (
                        <img src={newPost.image} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <>
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Camera className="h-6 w-6" />
                          </div>
                          <p className="text-xs font-bold text-muted-foreground uppercase">Tap to simulate image selection</p>
                        </>
                      )}
                      <input 
                        type="text" 
                        placeholder="Paste image URL for demo..." 
                        className="absolute inset-x-4 bottom-4 h-8 px-3 rounded-lg bg-background/90 text-[10px] border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                        value={newPost.image}
                        onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Where was this?" 
                          className="pl-10 h-11 rounded-xl"
                          required
                          value={newPost.location}
                          onChange={(e) => setNewPost({...newPost, location: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Caption</label>
                      <textarea 
                        placeholder="Write something about your trip..." 
                        className="w-full min-h-[100px] p-4 rounded-2xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm resize-none"
                        required
                        value={newPost.caption}
                        onChange={(e) => setNewPost({...newPost, caption: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold">
                    Post to Community <Send className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
