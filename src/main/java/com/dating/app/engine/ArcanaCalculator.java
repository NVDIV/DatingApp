package com.dating.app.engine;

import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ArcanaCalculator {
    public Integer calculatePersonalArcana(LocalDate birthDate) {
        if (birthDate == null) return null;

        // For example: 15.05.1995 -> 1+5 + 0+5 + 1+9+9+5 = 35
        int sum = sumDigits(birthDate.getDayOfMonth()) +
                sumDigits(birthDate.getMonthValue()) +
                sumDigits(birthDate.getYear());

        return reduceToArcana(sum);
    }

    public Integer calculateCompatibility(Integer arcana1, Integer arcana2) {
        if (arcana1 == null || arcana2 == null) return null;
        return reduceToArcana(arcana1 + arcana2);
    }

    private Integer sumDigits(Integer num) {
        int sum = 0;
        while (num > 0) {
            sum += num % 10;
            num /= 10;
        }
        return sum;
    }

    private Integer reduceToArcana(Integer num) {
        if (num <= 22 && num > 0) {
            return num;
        }
        // For example: 35 -> 3+5 = 8
        int sum = sumDigits(num);

        return (sum > 22) ? reduceToArcana(sum) : sum;
    }
}
