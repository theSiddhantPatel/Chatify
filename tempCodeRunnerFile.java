import java.util.*;
import java.lang.*;
import java.io.*;

class ok {
    public static void main (String[] args) throws java.lang.Exception {
        Scanner s = new Scanner(System.in);
        int t = s.nextInt();
        while (t-- > 0) {
            int n = s.nextInt();
            int x = s.nextInt();  // Your score
            int k = s.nextInt();  // Number of attempts
            int[] scores = new int[n];
            
            for (int i = 0; i < n; i++) {
                scores[i] = s.nextInt();
            }
            
            // Count how many participants have score >= x
            int betterOrEqual = 0;
            for (int i = 0; i < n; i++) {
                if (scores[i] >= x) {
                    betterOrEqual++;
                }
            }
            
            // With k attempts, we can remove at most k participants 
            // who have scores higher than us
            int removable = 0;
            for (int i = 0; i < n; i++) {
                if (scores[i] > x) {  // Only those strictly better than us
                    removable++;
                }
            }
            
            // We can remove min(k, removable) participants
            int removed = Math.min(k, removable);
            
            // Final rank calculation: 
            // Rank = (number of people with score >= our score) + 1
            // But we removed some people who had scores > ours
            int finalBetterOrEqual = betterOrEqual - removed;
            
            // If final rank <= x, we succeed
            if (finalBetterOrEqual <= x) {
                System.out.println("YES");  // or whatever the output should be
            } else {
                System.out.println("NO");
            }
        }
    }
}